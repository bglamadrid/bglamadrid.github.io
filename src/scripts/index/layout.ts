import { forkJoin, from, fromEvent, merge, of, Subject, timer } from 'rxjs';
import { elementAt, filter, finalize, map, switchMap, takeUntil, tap, toArray } from 'rxjs/operators';
import { iconSrc } from '../../lib/iconSrc';

const areWeDoneTransformingLayout = new Subject<void>();
let currentIndex = 0;
let pageSections: NodeListOf<Element>;

fromEvent(document, 'DOMContentLoaded').pipe(
  tap(() => { pageSections = document.querySelectorAll('main > *') as NodeListOf<Element>; }),
  switchMap(() => changeDocumentLayout()),
  takeUntil(areWeDoneTransformingLayout.asObservable())
).subscribe();

function changeDocumentLayout() {
  return merge(
    of(document.querySelector('body') as Element).pipe(
      map(body => {
        // construct nav buttons
        const { element, buttons } = createArrowButtons('fixed top-2 right-2 bottom-2 left-2 flex items-center place-content-between');
        body.appendChild(element); // container element
        return buttons;
      }),
      switchMap(buttons => forkJoin([
        ...buttons.map(b => fromEvent(b, 'click').pipe( // when a nav button is clicked,
          map(() => onNavigation(b) as SectionNavigationEvent),
          tap(navigation => {
            if (!Number.isNaN(navigation.targetIndex) && navigation.targetIndex !== currentIndex) {
              navigateToSection(navigation);
            }
          })
        ))
      ]))
    ),
    of(document.querySelector('main') as Element).pipe(
      tap(elem => { elem.className = 'relative grid grid-cols-1'; })
    ),
    from(pageSections).pipe(
      tap(element => {
        element.className = 'fixed top-4 right-4 bottom-4 left-4 invisible grid items-center justify-content-stretch p-2';
        const container = (element.querySelector('.container') as Element);
        container.classList.remove('my-2', 'mt-2', 'mb-2', 'mb-4');
        container.classList.add('content-center');
      }),
      toArray(),
      tap(elements => {
        elements[0].classList.remove('invisible');
      })
    )
  ).pipe(
    finalize(() => {
      areWeDoneTransformingLayout.next();
      areWeDoneTransformingLayout.complete();
    })
  );
}

function onNavigation(button: HTMLButtonElement): SectionNavigationEvent | undefined {
  if (button.classList.contains('left')) {
    return {
      direction: 'left',
      targetIndex: (currentIndex > 0) ? (currentIndex - 1) : (pageSections.length - 1)
    };
  } else if (button.classList.contains('right')) {
    return {
      direction: 'right',
      targetIndex: (currentIndex < pageSections.length - 1) ? (currentIndex + 1) : 0
    };
  }
}

function createArrowButtons(classes = '') {
  const element = document.createElement('div');
  const arrowDirections: { [key: number]: string } = {
    0: 'left',
    1: 'right'
  };
  const buttons = [];
  for (let i = 0; i < 2; i++) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'p-2 bg-[rgba(0,0,0,0.2)] ' + arrowDirections[i];
    button.title = arrowDirections[i];
    const arrow = document.createElement('img');
    arrow.className = 'w-8 dark:invert';
    arrow.src = iconSrc({ source: 'fontawesome', name: `chevron-${arrowDirections[i]}` });
    arrow.alt = arrowDirections[i];
    button.appendChild(arrow);
    buttons.push(button);
    element.appendChild(button);
  }
  element.className = classes;
  return {
    element,
    buttons
  };
}

function navigateToSection(ev: SectionNavigationEvent): void {
  pageSections.forEach(elem => elem.classList.add('invisible'));
  const previousSection = pageSections[currentIndex];
  const targetSection = pageSections[ev.targetIndex];
  const previousSectionAnimClass = 'animate__' + (ev.direction === 'left' ? 'fadeOutRight' : 'fadeOutLeft');
  const targetSectionAnimClass = 'animate__' + (ev.direction === 'left' ? 'fadeInLeft' : 'fadeInRight');
  [previousSection, targetSection].forEach(elem => {
    elem.classList.remove('invisible');
    elem.classList.add('animate__animated');
    elem.classList.add('animate__faster');
  });
  previousSection.classList.add(previousSectionAnimClass);
  targetSection.classList.add(targetSectionAnimClass);
  timer(400).pipe(
    tap(() => {
      [previousSection, targetSection].forEach(elem => {
        elem.classList.remove('animate__animated');
        elem.classList.remove('animate__faster');
      });
      previousSection.classList.remove(previousSectionAnimClass);
      targetSection.classList.remove(targetSectionAnimClass);
      previousSection.classList.add('invisible');
      currentIndex = ev.targetIndex;
    })
  ).subscribe();
}

interface SectionNavigationEvent {
  direction: 'left' | 'right';
  targetIndex: number;
}

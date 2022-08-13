import { from, fromEvent, merge, of, timer } from 'rxjs';
import { filter, finalize, ignoreElements, map, switchMap, tap, throttleTime } from 'rxjs/operators';
import { iconSrc } from '../../lib/iconSrc';

let currentIndex = 0;
let pageSections: NodeListOf<Element>;

fromEvent(document, 'DOMContentLoaded').pipe(
  switchMap(() => changeDocumentLayout())
).subscribe();

// there is an unintended document flashing effect... what could be causing it?
function changeDocumentLayout() {
  return merge(
    of(document.querySelector('main') as Element).pipe(
      tap(mainNode => { mainNode.classList.add('hidden'); }),
      map(mainNode => (mainNode.cloneNode(true) as Element)),
      tap(mainNodeClone => {
        mainNodeClone.className = '__scripted';
        (document.querySelector('body') as Element).appendChild(mainNodeClone);
      }),
      map(mainNodeClone => mainNodeClone.childNodes as NodeListOf<HTMLElement>),
      tap(sections => { pageSections = sections; }),
      switchMap(sections => from(sections).pipe(
        tap(section => {
          section.removeAttribute('id'); // prevent duplicate ids
          section.className = 'hidden invisible';
          const container = (section.querySelector('.container') as Element);
          container.classList.remove('my-2', 'mt-2', 'mb-2', 'mb-4', 'md:mb-4');
          container.classList.add('block', 'text-center', 'max-h-[80vh]', 'overflow-auto'); // somehow no scrolling happens for overflowing content?
        }),
        finalize(() => {
          sections[0].className = 'grid items-center justify-items-center min-h-screen w-screen p-4';
        })
      )),
      ignoreElements()
    ),
    of(document.querySelector('body') as Element).pipe(
      map(body => {
        const { element, buttons } = createArrowButtons('fixed top-2 right-2 bottom-2 left-2 flex items-center place-content-between');
        body.appendChild(element); // append buttons container element to body
        return buttons;
      }),
      switchMap(buttons =>
        merge(
          ...buttons.map(b => fromEvent(b, 'click').pipe( // when a nav button is clicked,
            map(() => b)
          ))
        ).pipe(
          throttleTime(150),
          map(b => onNavigation(b) as SectionNavigationEvent),
          filter(navigation => (!Number.isNaN(navigation.targetIndex) && navigation.targetIndex !== currentIndex)),
          tap(navigateToSection)
        )
      )
    )
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
    button.className = 'z-20 p-2 bg-[rgba(0,0,0,0.2)] ' + arrowDirections[i];
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
  if (!window.matchMedia('(prefers-reduced-motion)').matches) {
    const previousSectionAnimClass = 'animate__' + (ev.direction === 'left' ? 'fadeOutRight' : 'fadeOutLeft');
    const targetSectionAnimClass = 'animate__' + (ev.direction === 'left' ? 'fadeInLeft' : 'fadeInRight');
    [previousSection, targetSection].forEach(elem => {
      elem.className = 'grid items-center justify-items-center min-h-screen w-screen p-4 animate__animated animate__faster';
    });
    previousSection.classList.add(previousSectionAnimClass);
    targetSection.classList.add(targetSectionAnimClass);
    timer(200).pipe(
      tap(() => {
        previousSection.className = 'hidden';
        targetSection.classList.remove('animate__animated', 'animate__faster');
        currentIndex = ev.targetIndex;
      })
    ).subscribe();
  } else {
    currentIndex = ev.targetIndex;
    targetSection.className = 'grid items-center justify-items-center min-h-screen w-screen p-4';
  }
}

interface SectionNavigationEvent {
  direction: 'left' | 'right';
  targetIndex: number;
}

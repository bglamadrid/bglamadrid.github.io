import { forkJoin, from, fromEvent, merge, of, Subject } from 'rxjs';
import { finalize, map, switchMap, takeUntil, tap, toArray } from 'rxjs/operators';
import { iconSrc } from '../../lib/iconSrc';

const areWeDone = new Subject<void>();
let currentIndex = 0;
let pageSections: NodeListOf<Element>;

function executeAHeavyLayoutShift() {
  return merge(
    of(document.querySelector('body') as Element).pipe(
      map(body => {
        const { element, buttons } = createArrows('fixed top-2 right-2 bottom-2 left-2 flex items-center place-content-between');
        body.appendChild(element);
        return buttons;
      }),
      switchMap(buttons => forkJoin([
        ...buttons.map(b => fromEvent(b, 'click').pipe(
          tap(() => {
            let targetIndex = onArrowButtonClick(b);
            if (targetIndex !== currentIndex) {
              currentIndex = targetIndex;
              slideToCurrentSection();
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
      areWeDone.next();
      areWeDone.complete();
    })
  );
}

function onArrowButtonClick(b: HTMLButtonElement) {
  let targetIndex = currentIndex;
  if (b.classList.contains('left')) {
    if (currentIndex > 0) {
      targetIndex--;
    } else {
      targetIndex = pageSections.length - 1;
    }
  } else if (b.classList.contains('right')) {
    if (currentIndex < pageSections.length - 1) {
      targetIndex++;
    } else {
      targetIndex = 0;
    }
  }
  return targetIndex;
}

function createArrows(classes = '') {
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
    const arrow = document.createElement('img');
    arrow.className = 'w-8 dark:invert';
    arrow.src = iconSrc({ source: 'fontawesome', name: `chevron-${arrowDirections[i]}` });
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

function slideToCurrentSection() {
  pageSections.forEach(elem => elem.classList.add('invisible'));
  pageSections[currentIndex].classList.remove('invisible');
}

fromEvent(document, 'DOMContentLoaded').pipe(
  tap(() => { pageSections = document.querySelectorAll('main > *') as NodeListOf<Element>; }),
  switchMap(() => executeAHeavyLayoutShift()),
  takeUntil(areWeDone.asObservable())
).subscribe();

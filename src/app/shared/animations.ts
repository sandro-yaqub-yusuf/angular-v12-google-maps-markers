import { animate, keyframes, query, stagger, state, style, transition, trigger } from '@angular/animations';

const enterTransition = transition(':enter', [
  style({
    opacity: 0
  }),
  animate('0.5s ease-in', style({
    opacity: 1
  }))
]);

const leaveTrans = transition(':leave', [
  style({
    opacity: 1
  }),
  animate('0.5s ease-out', style({
    opacity: 0
  }))
]);

export const fadeIn = trigger('fadeIn', [
  enterTransition
]);

export const fadeOut = trigger('fadeOut', [
  leaveTrans
]);

export const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(
      ':enter',
      [
        style({ opacity: 0 }),
        stagger('30ms', animate('300ms ease-out', style({ opacity: 1 }))),
      ],
      { optional: true }
    )
  ])
]);

export const panelAnimation = trigger('panelAnimation', [
  state('criado', style({
    opacity: 1
  })),
  transition('void => criado', [
    style ({
      opacity: 0,
      transform: 'translate( 50px, 0 )'
    }),

    animate ('1.5s 0s ease-in-out', keyframes([
      style ({ offset: 0.15, opacity: 1, transform: 'translateX(0)' }),
      style ({ offset: 1, opacity: 1, transform: 'translateX(0)' })
    ]))
  ])
]);

export const formAnimation = trigger ('formAnimation', [
  state('normal', style({
    opacity: 1
  })),
  state('error', style({
    opacity: 1
  })),
  transition('normal => error', [
    style ({
      opacity: 1
    }),
    animate ('400ms ease-in-out', keyframes([
      style ({ offset: 0, transform: 'translateX(0)' }),
      style ({ offset: 0.2, transform: 'translateX(-4px)' }),
      style ({ offset: 0.4, transform: 'translateX(4px)' }),
      style ({ offset: 0.6, transform: 'translateX(-3px)' }),
      style ({ offset: 0.8, transform: 'translateX(2px)' }),
      style ({ offset: 1, transform: 'translateX(0)' })
    ]))
  ])
]);

export const menuAnimation = trigger('menuAnimation', [
  transition('void => left', [
    style({ transform: 'translateX(50%)', opacity: 0 }),
    animate('0.1s ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
  ]),
  transition('left => void', [
    animate('0.1s ease-in', style({ transform: 'translateX(-50%)', opacity: 0 }))
  ]),
  transition('void => right', [
    style({ transform: 'translateX(-50%)', opacity: 0 }),
    animate('0.1s ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
  ]),
  transition('right => void', [
    animate('0.1s ease-in', style({ transform: 'translateX(50%)', opacity: 0 }))
  ])
]);

export const collapseFade = trigger('collapseFade', [
  transition(':enter', [
    style({
      height: 0,
      opacity: 0,
      marginTop: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
      overflow: 'hidden',
    }),
    animate('250ms ease', style({
      height: '*',
      opacity: 1,
      marginTop: '*',
      marginBottom: '*',
      paddingTop: '*',
      paddingBottom: '*',
      overflow: 'hidden',
    })),
  ]),

  transition(':leave', [
    style({
      height: '*',
      opacity: 1,
      marginTop: '*',
      marginBottom: '*',
      paddingTop: '*',
      paddingBottom: '*',
      overflow: 'hidden',
    }),
    animate('250ms ease', style({
      height: 0,
      opacity: 0,
      marginTop: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
      overflow: 'hidden',
    })),
  ]),
]);
import { animate, query, stagger, style, transition, trigger } from "@angular/animations";

export const listAnimation = trigger('listAnimation', [
    transition('* <=> *', [
        query(':enter',
            [style({ transform: 'translateX(50%)', opacity: 0 }), stagger('100ms', animate('1000ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 })))],
            { optional: true }
        ),
        query(':leave',
            animate('200ms', style({ opacity: 0 })),
            { optional: true }
        )
    ])
]);

export const scaleAnimation = trigger('scaleAnimation', [
    transition(':enter', [
        style({ transform: 'translateX(-50%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateX(0%)', opacity: 1 })),
    ]),
    transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1 }),
        animate('500ms', style({ transform: 'scale(0)', opacity: 0 })),
    ]),
]);
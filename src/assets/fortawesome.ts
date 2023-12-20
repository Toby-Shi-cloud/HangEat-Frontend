/* import the fontawesome core */
import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {
    faA, faSun, faMoon, faCircleExclamation, faCircleCheck,
    faPencil, faHeart, faUpRightFromSquare, faLocationDot,
    faPhone,
} from '@fortawesome/free-solid-svg-icons';
import {
    faHeart as farHeart,
    faPenToSquare as farPenToSquare,
} from '@fortawesome/free-regular-svg-icons';

library.add(
    faA, faSun, faMoon, faCircleExclamation, faCircleCheck,
    faPencil, faHeart, faUpRightFromSquare, faLocationDot,
    faPhone,
);
library.add(
    farHeart, farPenToSquare
);

export default FontAwesomeIcon;

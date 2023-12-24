/* import the fontawesome core */
import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {
    faA, faSun, faMoon, faCircleExclamation, faCircleCheck,
    faPencil, faHeart, faUpRightFromSquare, faLocationDot,
    faPhone, faTags, faStar, faThumbsUp, faStarHalfStroke,
    faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import {
    faHeart as farHeart,
    faPenToSquare as farPenToSquare,
    faStar as farStar,
    faThumbsUp as farThumbsUp,
} from '@fortawesome/free-regular-svg-icons';

library.add(
    faA, faSun, faMoon, faCircleExclamation, faCircleCheck,
    faPencil, faHeart, faUpRightFromSquare, faLocationDot,
    faPhone, faTags, faStar, faThumbsUp, faStarHalfStroke,
    faMagnifyingGlass,

);
library.add(
    farHeart, farPenToSquare, farStar, farThumbsUp,
);

export default FontAwesomeIcon;

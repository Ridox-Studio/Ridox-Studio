import { domMax } from "framer-motion";

/**
 * framer-motion's animation features, split out of the first-load bundle.
 * MotionProvider loads this with a dynamic import, so the page hydrates with
 * the lightweight `m` components and the features (gestures, drag, layout)
 * stream in straight after.
 *
 * domMax rather than domAnimation because FloatingTrigger uses `drag`.
 */
export default domMax;

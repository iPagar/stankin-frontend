import {
  REQUEST_INIT,
  RECEIVE_INIT,
  INVALIDATE_INIT,
  SELECT_SEMESTER,
  RECEIVE_NOTIFY,
  RECEIVE_EXIT,
} from "../actionTypes";

const InitialState = {
  isFetching: true,
  didInvalidate: false,
  selectedSemester: 0,
  student: {},
  semesters: [],
  marks: [],
};

export default function(state = InitialState, action) {
  switch (action.type) {
    case INVALIDATE_INIT: {
      return { ...state, didInvalidate: true };
    }
    case REQUEST_INIT: {
      return { ...state, isFetching: true, didInvalidate: false };
    }
    case RECEIVE_INIT: {
      const {
        student,
        semesters,
        marks,
        favouriteGroup,
        favouriteStgroup,
      } = action.payload;

      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        selectedSemester: [...semesters].length - 1,
        student: { ...student },
        semesters: [...semesters],
        marks: [...marks],
        favouriteGroup,
        favouriteStgroup,
      };
    }
    case RECEIVE_NOTIFY: {
      const { notify } = state.student;
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        student: { ...state.student, notify: !notify },
      };
    }
    case RECEIVE_EXIT: {
      return {
        ...InitialState,
      };
    }
    case SELECT_SEMESTER: {
      const content = action.payload;

      return {
        ...state,
        selectedSemester: content,
      };
    }
    default:
      return state;
  }
}

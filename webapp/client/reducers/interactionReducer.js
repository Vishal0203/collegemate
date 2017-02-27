import * as actions from '../actions/interactions/index';

const initialState = {
  tags: [],
  filters: [],
  toggleForm: false,
  loadingMore: false,
  nextPageUrl: null,
  hasMore: true,
  skip: 0,
  items: {
    posts: []
  },
  postLoading: false,
  commentLoading: false,
  selectedPost: null,
  toggleCommentForm: false,
  togglePostUpdateForm: false
};

export default function interactionReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_POSTS_REQUEST:
    case actions.CREATE_POST_REQUEST: {
      return {...state, loadingMore: true}
    }
    case actions.CREATE_POST_RESPONSE: {
      const skip = state.skip + 1;
      let i = 0;
      let tag_guids = action.post.tags.map((tag) => {
        return tag.tag_guid;
      } );

      for(; i < state.filters.length; i++) {
        if (tag_guids.indexOf(state.filters[i].tag_guid) == -1)
        {
          break;
        }
      }
      if (i < state.filters.length) {
        return {
          ...state,
          loadingMore: false
        };
      }
      return {
        ...state,
        skip,
        items: {...state.items, posts: [action.post, ...state.items.posts]},
        loadingMore: false
      };
    }
    case actions.FETCH_POSTS_RESPONSE: {
      return {
        ...state,
        skip: state.skip,
        items: {...action.response, posts: [...state.items.posts, ...action.response.posts]},
        loadingMore: false,
        hasMore: !!action.response.next_page_url,
        nextPageUrl: action.response.next_page_url
      };
    }
    case actions.CREATE_POST_TOGGLE: {
      return {...state, toggleForm: !state.toggleForm};
    }
    case actions.TAGS_RESPONSE: {
      return {...state, tags: [...action.tags]}
    }
    case actions.ADD_TAG_FILTER: {
      const {tags, filters} = state;
      if (tags.length == filters.length) {
        return {
          ...initialState,
          tags,
          filters: [action.filter]
        }
      }
      else if (tags.length != filters.length && filters.indexOf(action.filter) == -1) {
        return {
          ...initialState,
          tags,
          filters: [action.filter, ...state.filters]
        }
      }
      else {
        return state;
      }
    }
    case actions.REMOVE_TAG_FILTER: {
      const {tags, filters} = state;
      const index = filters.indexOf(action.filter);
      let newFiltersSet = [...filters.slice(0, index), ...filters.slice(index + 1)];
      return {
        ...initialState,
        tags,
        filters: newFiltersSet
      }
    }
    case actions.FETCH_SINGLE_POST_REQUEST: {
      return {...state, postLoading: true}
    }
    case actions.FETCH_SINGLE_POST_RESPONSE: {
      if (state.selectedPost)
      {
        return {
          ...state,
          selectedPost: {
            ...action.response,
            isEditable: state.selectedPost.isEditable
          },
          postLoading: false
        }
      }
      if(action.response.error) {
        return {...state, postLoading: false}
      }
      return {...state, selectedPost:action.response.post, postLoading: false}
    }
    //Need to refactor later
    case actions.CLEAR_SELECTED_POST: {
      return {
        ...state,
        selectedPost: null
      }
    }
    case actions.TOGGLE_POST_UPVOTE_RESPONSE: {
      if(action.response.error) {
        return {...state, postLoading: false}
      }
      return {
        ...state,
        selectedPost: {
          ...state.selectedPost,
          upvotes_count: action.response.upvotes_count,
          upvoted: action.response.upvoted
        }
      }
    }
    case actions.DELETE_POST_REQUEST: {
      return {...state, postLoading: true}
    }
    case actions.DELETE_POST_RESPONSE: {
      return {...state, selectedPost: null, postLoading: false}
    }
    case actions.TOGGLE_POST_UPDATE_FORM: {
      return {...state, togglePostUpdateForm: !state.togglePostUpdateForm}
    }
    case actions.UPDATE_POST_REQUEST: {
      return {...state, postLoading: true}
    }
    case actions.UPDATE_POST_RESPONSE: {
      const postResponse = action.response.post;
      const updatedPost = {
        ...state.selectedPost,
        visibility: postResponse.visibility,
        is_anonymous: postResponse.is_anonymous,
        post_heading: postResponse.post_heading,
        post_description: postResponse.post_description,
        tags: postResponse.tags
      };

      if (state.selectedPost.user && !postResponse.user) {
        delete updatedPost.user;
      }

      if(!state.selectedPost.user && postResponse.user ) {
        updatedPost.user = postResponse.user;
      }
      return {
        ...state,
        selectedPost: updatedPost,
        togglePostUpdateForm: false,
        postLoading: false
      }
    }
    case actions.ADD_COMMENT_TOGGLE: {
      return {
        ...state,
        toggleCommentForm: !state.toggleCommentForm
      }
    }
    case actions.ADD_COMMENT_REQUEST: {
      return {...state, commentLoading: true}
    }
    case actions.ADD_COMMENT_RESPONSE: {
      return {
        ...state,
        toggleCommentForm: !state.toggleCommentForm,
        commentLoading: false,
        selectedPost: {
          ...state.selectedPost,
          comments: [action.response, ...state.selectedPost.comments],
          comments_count: state.selectedPost.comments_count + 1
        }
      }
    }
    case actions.TOGGLE_COMMENT_UPVOTE_RESPONSE: {
      if(action.response.error) {
        return state
      }
      let newComments = [...state.selectedPost.comments];
      const index = newComments.indexOf(action.comment);
      const updatedComment = {
        ...newComments[index],
        upvotes_count: action.response.upvotes_count,
        upvoted: action.response.upvoted
      };
      newComments.splice(index, 1, updatedComment);
      return {
        ...state,
        selectedPost: {
          ...state.selectedPost,
          comments: newComments
        },
      }
    }
    case actions.DELETE_COMMENT_REQUEST: {
      return {
        ...state,
        commentLoading: true
      }
    }
    case actions.DELETE_COMMENT_RESPONSE: {
      if(action.response.error) {
        return {
          ...state,
          commentLoading: false
        }
      }
      let newComments = [...state.selectedPost.comments];
      const index = newComments.indexOf(action.comment);
      newComments.splice(index, 1);
      return {
        ...state,
        selectedPost: {
          ...state.selectedPost,
          comments: newComments,
          comments_count: state.selectedPost.comments_count-1
        },
        commentLoading: false
      }
    }
    case actions.EDIT_COMMENT_REQUEST: {
      return {
        ...state,
        commentLoading: true
      }
    }
    case actions.EDIT_COMMENT_RESPONSE: {
      if(action.response.error) {
        return {...state, commentLoading: false}
      }
      let newComments = [...state.selectedPost.comments];
      const index = newComments.indexOf(action.comment);
      const updatedComment = {
        ...newComments[index],
        comment: action.response.comment.comment,
        updated_at: action.response.comment.updated_at
      };
      newComments.splice(index, 1, updatedComment);
      return {
        ...state,
        selectedPost: {
          ...state.selectedPost,
          comments: newComments
        },
        commentLoading: false
      }
    }

    case '@@router/LOCATION_CHANGE': {
      if (action.payload.pathname == '/interactions') {
        return {
          ...initialState,
          tags: state.tags
        }
      }
    }
    default: {
      return state
    }
  }
}
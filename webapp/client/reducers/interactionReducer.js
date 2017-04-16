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
  togglePostUpdateForm: false,
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
        if (tag_guids.indexOf(state.filters[i].tag_guid) === -1)
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
      if (tags.length === filters.length) {
        return {
          ...initialState,
          tags,
          filters: [action.filter]
        }
      }
      else if (tags.length !== filters.length && filters.indexOf(action.filter) === -1) {
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
      return {
        ...state,
        selectedPost: null,
        postLoading: true
      }
    }
    case actions.FETCH_SINGLE_POST_RESPONSE: {
      if(action.response.error) {
        return {...state, postLoading: false}
      }
      return {...state, selectedPost:action.response.post, postLoading: false}
    }
    case actions.POST_UPDATE: {
      if (action.response.type === 'new-reply') {
        return state
      }

      if (action.response.type === 'delete-reply') {
        return {
          ...state,
          selectedPost: {
            ...state.selectedPost,
            replies:  state.selectedPost.replies.filter(
              (reply) => reply.reply_guid !== action.response.reply_guid
            )
          }
        }
      }

      let comments = [...state.selectedPost.comments];
      let replies = [...state.selectedPost.replies];

      updateUserVisiblity(state, action, comments);
      comments.forEach((comment) => updateUserVisiblity(state, action, comment.replies));
      updateUserVisiblity(state, action, replies);

      let newPost = {
        ...state.selectedPost,
        post_heading: action.response.post_heading,
        post_description: action.response.post_description,
        is_anonymous: action.response.is_anonymous,
        user: action.response.poster,
        tags: action.response.tags,
        replies,
        comments
      };

      if (newPost.user == null) {
        delete(newPost.user);
      }

      return {
        ...state,
        selectedPost: newPost
      }
    }
    case actions.COMMENT_UPDATE: {
      const {comment_guid, type} = action.commentUpdates;
      if(type === 'deleted-comment') {
        return {
          ...state,
          selectedPost: {
            ...state.selectedPost,
            comments: state.selectedPost.comments.filter((comment) => comment.comment_guid !== comment_guid)
          }
        }
      }
      return state;
    }
    case actions.FETCH_SINGLE_REPLY_RESPONSE: {
      return {
        ...state,
        selectedPost: {
          ...state.selectedPost,
          replies: [...state.selectedPost.replies, action.reply]
        }
      }
    }
    case actions.FETCH_SINGLE_COMMENT_RESPONSE: {
      let newComments = [...state.selectedPost.comments];
      let commentGuids = newComments.map((comment) => comment.comment_guid);
      const index = commentGuids.indexOf(action.comment.comment_guid);
      if (index !== -1) {
        const updatedComment = {
          ...newComments[index],
          comment: action.comment.comment,
          replies: action.comment.replies,
          updated_at: action.comment.updated_at
        };
        newComments.splice(index, 1, updatedComment);
      }
      else {
        newComments.unshift(action.comment)
      }
      return {
        ...state,
        selectedPost: {
          ...state.selectedPost,
          comments: newComments
        }
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
      return {
        ...state,
        togglePostUpdateForm: false,
        postLoading: false
      }
    }
    case actions.CLEAR_SINGLE_POST: {
      if(state.selectedPost && state.selectedPost.post_guid === action.postGuid)
      {
        return {
          ...state,
          selectedPost: null
        }
      }
      return state;
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
        commentLoading: false
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
      return {...state, commentLoading: true}
    }
    case actions.DELETE_COMMENT_RESPONSE: {
      return {...state, commentLoading: false}
    }
    case actions.EDIT_COMMENT_REQUEST: {
      return {...state, commentLoading: true}
    }
    case actions.EDIT_COMMENT_RESPONSE: {
      return {...state, commentLoading: false}
    }

    case '@@router/LOCATION_CHANGE': {
      if (action.payload.pathname === '/interactions') {
        return {
          ...initialState,
          tags: state.tags,
          filters: state.filters,
          selectedPost: state.selectedPost
        }
      }
      return state
    }
    default: {
      return state
    }
  }
}

function updateUserVisiblity(state, action, entities) {
  if (action.response.is_anonymous) {
    entities.forEach((entity) => {
      if (entity.user &&
        state.selectedPost.user &&
        entity.user.user_guid === state.selectedPost.user.user_guid) {
        delete(entity.user);
      }
    });
  } else {
    entities.forEach((entity) => {
      if (!entity.user) {
        entity.user = action.response.poster;
      }
    });
  }
}

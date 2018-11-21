export default (state = null, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'TOKEN_SET': {
      return payload;
    }
    case 'TOKEN_DELETE': return null;
    default: return state;
  }
};

const postsQuery = (reqQuery) => {
  const settings = {
    filter: {},
    sort: { postDate: -1 },
    skip: 0,
    limit: 25,
    sortStage: null
  };

  if(Object.keys(reqQuery).length){
    Object.keys(reqQuery).forEach(key => {
      const [action, param, operator] = key.split('_');
      if(action === 'sort'){
        const sortValue = Number(reqQuery[key]);
        if(param === 'replyCount'){
          settings.sortStage = { replyCount: sortValue };
        } else{
          settings.sort[param] = sortValue;
        }
      } else if(action === 'skip'){
        settings.skip = Number(reqQuery[key]);
      } else if(action === 'limit'){
        settings.limit = Number(reqQuery[key]);
      } else if(action === 'filter'){
        if(!operator){
          if(isNaN(reqQuery[key])){
            settings.filter[param] = { $regex: new RegExp(reqQuery[key], 'i')};
          } else {
            settings.filter[param] = Number(reqQuery[key]);
          };
        } else {
          if(!settings.filter[param]){
            settings.filter[param] = {};
          };
          settings.filter[param][`$${operator}`] = Number(reqQuery[key]);
        };
      };
    });
  };

  return settings;

};

export { postsQuery };
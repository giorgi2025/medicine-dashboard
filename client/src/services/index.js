//Admin side services
export const filter = (items, filterObj) => {

    let searchKeyword = filterObj.searchKeyword;
    var searchResult = [];

    //At first, search
    //two search condition are null
    if(searchKeyword === "") {
        searchResult = items;
    } else { 
        //Search by keyword
        for(let i = 0 ; i < items.length ; i ++) {
            if( searchKeyword === items[i].upc) {
              searchResult.push(item);
            }
        }
    }

    return searchResult;
  }
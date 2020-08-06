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
              searchResult.push(items[i]);
            }
        }
    }

    return searchResult;
}

//Submitted => 0, Approved => 1, ..., Confirmed => 4, Done => 5
export const getTabIndexFromText = (tabStr) => {
    let tabIndex = 0;
    if(tabStr !== undefined) {
        switch(tabStr) {
            case "Submitted":
                tabIndex = 0;
                break;
            case "Approved":
                tabIndex = 1;
                break;
            case "Arabic":
                tabIndex = 2;
                break;
            case "Completed":
                tabIndex = 3;
                break;
            case "Confirmed":
                tabIndex = 4;
                break;
            case "Done":
                tabIndex = 5;
                break;
            default:
                tabIndex = 0;
                break;
        }

    }
    return tabIndex;
}

//Get brand's name & picture by brand's id.
export const getBrandInfoByBrandId = (brands, currentBrandId) => {
    let name = "", picture = "";
    brands.map(brand => {
        if(brand._id === currentBrandId) {
            name = brand.name;
            picture = brand.picture;
        }
    });
    return {
        brandName: name,
        brandPicture: picture,
    }
}

//Get number of each category such as Submitted, Approved, Arabic, Completed, Confirmed and Done
export const getCategoryCount = (items, currentBrandId) => {
    let tempSubmittedCount = 0;
    let tempApprovedCount = 0;
    let tempArabicCount = 0;
    let tempCompletedCount = 0;
    let tempConfirmedCount = 0;
    let tempDoneCount = 0;

    items.map(item => {
        if(item._brandId._id === currentBrandId) {
            switch(item.status) {
                case "Submitted":
                    tempSubmittedCount ++;
                    break;
                case "Approved":
                    tempApprovedCount ++;
                    break;
                case "Arabic":
                    tempArabicCount ++;
                    break;
                case "Completed":
                    tempCompletedCount ++;
                    break;
                case "Confirmed":
                    tempConfirmedCount ++;
                    break;
                case "Done":
                    tempDoneCount ++;
                    break;
                default:
                    tempSubmittedCount ++;
                    break;
            }
        }
    })

    return {
        SubmittedCount: tempSubmittedCount,
        ApprovedCount: tempApprovedCount,
        ArabicCount: tempArabicCount,
        CompletedCount: tempCompletedCount,
        ConfirmedCount: tempConfirmedCount,
        DoneCount: tempDoneCount,
    }

}

export const createBrandsList = (brands, role) => {
    let tempBrandsList = [];
    let number = 0;
    
    if(role === 0) {        // admin
        brands.map( brand => {
            let oneBrand = {
                number: number,
                _brandId: brand._id,
                allow: brand.allow,
                name: brand.name,
                picture: brand.picture
            }
            tempBrandsList.push(oneBrand);
            number ++;
        });
    } else if( role === 1) {        // user
        brands.map( brand => {
            let oneBrand = {
                number: number,
                _brandId: brand._brandId._id,
                allow: brand._brandId.allow,
                name: brand._brandId.name,
                picture: brand._brandId.picture
            }
            tempBrandsList.push(oneBrand);
            number ++;
        });
    }
    return tempBrandsList;
}

//Create user's list.
export const createUsersList = () => {

}
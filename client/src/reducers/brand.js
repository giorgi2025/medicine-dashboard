import * as types from '../constants/ActionTypes'


export const brandState = {
    activeBrands: [],
    deletedBrands: [],
};

export default function(state = brandState, action) {
    switch(action.type) {

        case types.ALL_BRANDS: {
            let brands = action.payload;
            let activeBrands = [];
            let deletedBrands = [];
            brands.map(brand => {
                if(brand.allow)
                    activeBrands.push(brand);
                else
                    deletedBrands.push(brand);
            })

            return {
                ...state,
                activeBrands: activeBrands,
                deletedBrands: deletedBrands
            }
        }

        default:
            return state;
    }
}

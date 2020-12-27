import { Cloth, ICloth } from '../../../db/models/cloth';
import { LooseObject } from '../../../utils/models';

export const getClothes = async (filter: LooseObject) => {
    const a = await Cloth.find(filter);
    return a;
};

export const createCloth = async (cloth: ICloth) => {
    const clothObject = new Cloth(cloth);
    
    return await clothObject.save((error, document) => {
        if(error) {
            return false;
        }
        return true;
    });
}
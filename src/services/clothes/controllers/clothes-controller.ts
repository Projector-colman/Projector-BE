import * as provider from "../providers/clothes-provider";
import { ICloth, ParsedCloth } from '../../../db/models/cloth';
import { LooseObject } from "../../../utils/models";
import { toArray } from "../../../utils/index";

export const getCloth = async (params: any) => {
    let filter: LooseObject = {};
    let retClothes: ParsedCloth[] = [];
    // Init filter options if required
    if(params.minPrice || params.maxPrice) {
        filter.price = {};
    }
    if(params.size) {
        filter.size = {};
    }

    // Regex for /name/ is like *name*
    params.name     ? filter.name   = '/' + params.name + '/' : undefined;
    params.color    ? filter.color  = params.color : undefined;
    params.type     ? filter.type   = params.type : undefined;
    params.gender   ? filter.gender = params.gender : undefined;
    params.stock   ? filter.stock = params.stock : undefined;

    params.size     ? filter.size!.$in   = toArray(params.size) : undefined;
    params.minPrice ? filter.price!.$gte = params.minPrice : undefined;
    params.maxPrice ? filter.price!.$lte = params.maxPrice : undefined;

    // Group clothes into a single array that contains all of the sizes, colors and stock
    (await provider.getClothes(filter)).forEach(cloth => {
        let parsedCloth = retClothes.find(pCloth => pCloth.name === cloth.name);

        if(parsedCloth) {
            // insert a new ['size','stock'] to a specific color of a specific cloth
            if(!parsedCloth.properties[cloth.color]) {
                parsedCloth.properties[cloth.color] = [];
            }
            parsedCloth.properties[cloth.color].push([cloth.size,cloth.stock])
        }
        else {
            retClothes.push({name: cloth.name, 
                             gender: cloth.gender, 
                             price: cloth.price, 
                             type: cloth.type,
                             img: cloth.img,
                             properties: { [cloth.color] : [[cloth.size, cloth.stock]] }
            });
        }
    });

    return retClothes;
}

export const createCloth = async (cloth: ICloth) => {
    return await provider.createCloth(cloth);
}
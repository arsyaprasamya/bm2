/**
 * Building Database Services
 *
 */
const Building = require('./model').Building;

module.exports = {
    listBuilding : async function(query, page = 1, limit = 1000){
        try {
            var skip = (page - 1) * limit;
            let building;
            if(Object.keys(query).length === 0){
            building = await Building.find(query).skip(skip).limit(limit).populate("blk", "-__v").select('-__v').sort({$natural:-1});
            }else{
            building = await Building.findfind().or([{ 'nmbld': { $regex: `${query.nmbld}` }}, { 'addrbld': { $regex: `${query.nmbld}` }}]).skip(skip).limit(limit).populate("blk", "-__v").select('-__v').sort({$natural:-1});
            }
            if(building){
                return building;
            }else{
                return false;
            }
        } catch (e) {
            console.log(e);
        }
    },
    getBuildingById : async function(id){
        try {
            const building = await Building.findById(id).populate("blk", "-__").select('-__v');
            if(building){
                return building;
            }else{
                return false;
            }
        } catch (e) {
            console.log(e);
        }
    },
    getBuildingByParent : async function(id){
        try {
            const building = Building.find({blk: id}).populate("blk", "-__").select('-__v');
            if(building){
                return building
            }else{
                return false
            }
        }catch (e) {
            console.log(e);
        }
    },
    addBuilding : async function(building){
        try {
            const newBuilding = await new Building(building).save();
            if (newBuilding){
                return newBuilding;
            } else {
                return false;
            }
        } catch (e) {
            console.log(e);
        }
    },
    editBuilding : async function(id, building){
        try {
            const newBuilding = await Building.findByIdAndUpdate(id, building);
            if(newBuilding){
                return newBuilding;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    deleteBuilding : async function(id){
        const building = await Building.findByIdAndRemove(id);
        if(building){
            return true;
        }else{
            return false;
        }
    }

}
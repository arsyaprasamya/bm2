/**
 * Block Group Database Services
 */
const BlockGroup = require('./model').BlockGroup;

module.exports = {
    findAllGroup : async function(query, page = 1, limit = 1000){
        try{
            const skip = (page - 1) * limit;
            let blockgroup;
            if(Object.keys(query).length === 0){
                blockgroup = await BlockGroup.find().skip(skip).limit(limit).populate("blk", "-__v").select('-__v').sort({$natural:-1});
            }else{
                blockgroup = await BlockGroup.find().or([{
                    'grpnm': {$regex: `${query.grpnm}`}
                }]).skip(skip).limit(limit).populate("blk", "-__v").select('-__v').sort({$natural:-1});
            }
            return blockgroup;
        }catch (e) {
            console.log(e);
        }
    },
    findRecursive : async function(depth = 0){
        try{
            var blockgroup = await BlockGroup.aggregate([{ $match: { prntid: null } }]).graphLookup(
                {
                            from: 'blkbrp',
                            startWith: '$_id',
                            connectFromField: '_id',
                            connectToField: 'prntid',
                            as: 'chld',
                            maxDepth: 1
                        }
                );
            return blockgroup
        }catch (e) {
            console.log(e);
        }
    },
    findByGroupId : async function(id){
        try {
            var blockgroup = await BlockGroup.findById(id);
            return blockgroup;
        }catch (e) {
            console.log(e);
        }
    },
    addBlockGroup : async function(blockGroup){
        try {
            var blockgroup = await new BlockGroup(blockGroup).save();
            if(blockgroup){
                return blockgroup;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    updateBlockGroup: async function(id, blockgroup){
        try{
            var group = await BlockGroup.findByIdAndUpdate(id,blockgroup);
            if(group){
                return group;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    deleteBlockGroup : async function(id){
        try {
            var group = await BlockGroup.findByIdAndRemove(id);
            if (group){
                return true;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    }
}
/**
 * Block Database Services
 *
 */
const Block = require('./model').Block;

module.exports = {
    listBlock : async function(query, page = 1, limit = 1000){
        try {
            const skip = (page - 1) * limit;
            let block;

            if(Object.keys(query).length === 0){
                block = await Block.find(query).skip(skip).limit(limit).populate("grpid", "-__v").select('-__v').sort({$natural:-1});
                
            }else{
                block = await Block.find().or([
                    { 'cdblk': { $regex: `${query.cdblk}` }}]).skip(skip).limit(limit).
                    populate("grpid", "-__v").select('-__v').sort({$natural:-1});
            }
            if(block){
                return block;
            }else{
                return false;
            }
        } catch (e) {
            console.log(e);
        }
    },
    findBlockByParent: async function(id){
        try {
            const blok = await Block.find({grpid: id}).select("-__v");
            if(blok){
                return blok;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },
    findBlockById : async function(id){
        try {
            const block = await Block.findById(id);
            if(block){
                return block;
            }else {
                return false;
            }
        }catch (e) {
            console.log(e)
        }
    },

    addBlock : async function(block){
        try {
            const newBlock = await new Block(block).save();
            if (newBlock) {
                return newBlock;
            } else {
                return false;
            }
        } catch (e) {
            console.log(e);
        }
    },

    updateBlock : async function(id, block){
        try {
            const blck = await Block.findByIdAndUpdate(id, block);
            if(blck){
                return blck;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    },

    
    deleteBlock : async function(id){
        try {
            const block = await Block.findByIdAndRemove(id);
            if(block){
                return true;
            }else{
                return false;
            }
        }catch (e) {
            console.log(e);
        }
    }
}
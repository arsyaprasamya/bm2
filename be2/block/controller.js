const {addBlock, listBlock, findBlockById, deleteBlock, updateBlock, findBlockByParent} = require("./service");

module.exports = {
    addBlk : async function(req, res, next){
        const block = await addBlock(req.body);
        if(block){
            return res.status(200).json({"status": "success", "data": block});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },

    listBlk : async function(req, res, next){
        const str = JSON.parse(req.query.param);
        const allData = await listBlock({}, 1, 0);
        let query = {};
        if(str.filter !== null) query={cdblk: str.filter.cdblk};
        const block = await listBlock(query, str.pageNumber, str.limit);
        if(block){
            return res.status(200).json({"status": "success", "data": block, "totalCount": allData.length});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },
    
    updateBlk : async function(req, res, next){
        const block = await updateBlock(req.params.id, req.body);
        if(block){
            return res.status(200).json({"status": "success", "data": block});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },
    deleteBlk : async function(req, res, next){
        const block = await deleteBlock(req.params.id);
        if(block){
            return res.status(200).json({"status": "success", "data": "block deleted"});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },
    findBlock : async function(req, res, next){
        const block = await findBlockById(req.params.id);
        if(block){
            return res.status(200).json({"status": "success", "data": block});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },
    findBlockByParent : async function(req, res, next){
        try {
            const block = await findBlockByParent(req.params.id);
            if(block){
                return res.status(200).json({"status": "success", "data": block});
            }else{
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            console.log(e);
        }
    }

}
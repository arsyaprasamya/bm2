/**
 * @type BlockGroup Controller
 */

const { findByGroupId, findAllGroup, findRecursive, addBlockGroup, deleteBlockGroup, updateBlockGroup } = require('./service');

module.exports = {
    addBlkGrp : async function(req, res, next){
        const blkGroup = await addBlockGroup(req.body);
        if(blkGroup){
            return res.status(200).json({"status": "success", "data": blkGroup});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },
    listBlkGrp : async function(req, res, next){
        const str = JSON.parse(req.query.param);
        const allData = await findAllGroup({}, 1, 0);
        let query = {}
        if(str.filter !== null) query = {grpnm: str.filter.grpnm}
        const listBlkGrp = await findAllGroup(query, str.pageNumber, str.limit);
        if(listBlkGrp){
            return res.status(200).json({"status": "success", "data": listBlkGrp, "totalCount": allData.length});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },
    listBlkGrpRec : async function(req, res, next){
        const hierac = await findRecursive();
        if(hierac){
            return res.status(200).json({"status": "success", "data": hierac});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },
    updateGrpBlk : async function(req, res, next){
        const upd = await updateBlockGroup(req.params.id, req.body);
        if(upd){
            return res.status(200).json({"status": "success", "data": upd});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },
    deleteGrpBlk : async function(req, res, next){
        const del = await deleteBlockGroup(req.params.id);
        if(del){
            return res.status(200).json({"status": "success", "data": "group block deleted"});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },
    getGrpBlkById : async function(req, res, next){
        const blk = await findByGroupId(req.params.id);
        if(blk){
            return res.status(200).json({"status": "success", "data": blk});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    }
}
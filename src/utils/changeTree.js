let attr = {
    id: "id",
    isLeaf: "isLeaf",
    name: "name",
    nocheck: 'nocheck',
    open: 'open',
    pId: "pId",
    parent: 'parent',
    checked: "checked",
    icon: "icon",
    rootId:'0'
};
export function changeTreeData(data) {
    let tree = [];
    let resData = data; 
    for (let i = 0; i < resData.length; i++) {
        if (resData[i].pId === attr.rootId) {
            let obj = {
                id: resData[i][attr.id],
                isLeaf: resData[i][attr.isLeaf],
                name: resData[i][attr.name],
                nocheck: resData[i][attr.nocheck],
                open: resData[i][attr.open],
                pId: resData[i][attr.pId],
                parent: resData[i][attr.parent],
                checked: resData[i][attr.checked],
                icon: resData[i][attr.icon],
                children: []
            };
            tree.push(obj);
            resData.splice(i, 1);
            i--;
        }
    }
    var run = function(treeArrs) {
        if (resData.length > 0) {
            for (let i = 0; i < treeArrs.length; i++) {
                //console.log(i);
                for (let j = 0; j < resData.length; j++) {
                    if (treeArrs[i].id === resData[j][attr.pId]) {
                        let obj = {
                            id:resData[j][attr.id],
                            id: resData[j][attr.id],
                            isLeaf: resData[j][attr.isLeaf],
                            name: resData[j][attr.name],
                            nocheck: resData[j][attr.nocheck],
                            open: resData[j][attr.open],
                            pId: resData[j][attr.pId],
                            parent: resData[j][attr.parent],
                            checked: resData[j][attr.checked],
                            icon: resData[j][attr.icon],
                            children: []
                        };
                        treeArrs[i].children.push(obj);
                        resData.splice(j, 1);
                        j--;
                    }
                }
                run(treeArrs[i].children);
            }
        }
    };
    run(tree);
    /* console.log(tree) */
    return tree;
}
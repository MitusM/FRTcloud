import {
    path
} from 'path'
const dir = (dir) => {
    dir = dir ? ['../view/html/', dir] : ['../view/', 'html']
}

async function html(obj, res) {
    return await res.app.ask('render', {
        server: {
            action: 'html',
            meta: {
                dir: obj.dir,
                page: obj.page,
                data: {
                    ...obj.data
                }
            }
        }
    })
}

export {
    dir,
    html
}
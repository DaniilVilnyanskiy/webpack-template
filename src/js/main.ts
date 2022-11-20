//- import others files typescript



//- main scripts

const items = [

    { id: 5, parent: 2, type: 'test' },
    { id: 1, parent: 'root' },
    { id: 2, parent: 1, type: 'test' },
    { id: 3, parent: 1, type: 'test' },

    { id: 6, parent: 2, type: 'test' },
    { id: 4, parent: 2, type: 'test' },

    { id: 7, parent: 4, type: null },
    { id: 8, parent: 4, type: null },
];


class TreeStore {
    private readonly array: {[index: string]:any};
    private readonly newObj: {[index: string]:any} = {};
    private readonly newObjId: any[];

    /**
     * @param parameter - array
     */
    constructor(parameter: any) {
        this.array = parameter;
        this.newObj = {};
        this.newObjId = [];
        this.init()
    }

    /**
     * Получить весь массив
     */
    getAll = () => {
        return this.array
    }

    /**
     * Получить элемент массива по id
     * @param id - свойство id элемента массива
     */
    getItem = (id: any) => {
        return this.array[this.newObjId[id]];
    }
    /**
     * Получить у элемента по id, дочерний элемент в массиве
     * @param id - свойство id элемента массива
     */
    getChildren = (id: any) => {
        return (
            this.newObj[`parent${id}`]?.map((key: string | number) => {
                return this.array[key]
            })
        ) ?? []
    }
    /**
     * Получить у элемента по id, родительский элемент в массиве
     * @param id
     */
    getParent = (id: any) => {
        return (
            this.getItem(this.getItem(id)?.parent)
        ) ?? []
    }
    /**
     * Получить у элемента по id, все дочерние элементы
     * @param id
     */
    getAllChildren = (id: any) => {
        let children = this.getChildren(id)
        children?.forEach((el: any) => {
            children = children.concat(this.getAllChildren(el.id));
        })
        return children ?? []
    }
    /**
     * Получить у элемента по id, все родительские элементы
     * @param id
     */
    getAllParents = (id: number) => {
        let item = this.getItem(id);
        if (typeof item === "undefined") return []
        let parent = [item]
        if (typeof parent[0] !== "undefined") {
            parent = parent.concat(this.getAllParents(parent[0].parent))
        }

        return parent ?? [];
    }

    /**
     * Первоначальная функция, индексирует полученный массив в два новых массива
     */
    init = () => {
        for (let arrayKey in this.array) {
            let newKey = `parent${this.array[arrayKey].parent}`

            if ((typeof this.newObj[newKey]) === 'undefined') {
                this.newObj[newKey] = []
            }

            // массив содержащий ключи родителей и их дочерние элементы
            this.newObj[newKey].push(arrayKey)
            // массив содержащий ключи = el.id и значения ключ основного массива
            this.newObjId[this.array[arrayKey].id] = arrayKey

        }
        console.log(this.array);
        console.log(this.newObjId);
        console.log(this.newObj);
    }

    // далее ручные автотесты

    testGetItem = () => {
        for (const tsKey in this.array) {
            if (this.getItem(this.array[tsKey].id) !== this.array[tsKey]) {
                console.log('testGetItem error!');
            } else {
                console.log('testGetItem access!');
            }
        }
    }

    testGetChildren = () => {
        for (const tsKey in this.array) {
            if (JSON.stringify(this.getChildren(this.array[tsKey].id)) !== JSON.stringify(this.array.filter((el: {
                parent: any;}) => {
                return el.parent === this.array[tsKey].id
            }))) {
                console.log('testGetChildren error!');
            } else {
                console.log('testGetChildren access!');
            }
        }
    }

    testGetAllChildren = () => {
        for (const tsKey in this.array) {
            let allChild: {[index: string]:any} = []
            if (true) {
                // console.log(this.getAllChildren(this.array[tsKey].id));
                // console.log(this.getChildren(1));
                // console.log(this.array);

                for (let arrayKey in this.array) {
                    if (arrayKey >= tsKey && this.getChildren(arrayKey).length) {
                        this.getChildren(arrayKey).filter((el: any) => {
                            return allChild.push(el)
                        })
                    }
                }
                // console.log(allChild);
            }
            console.log(this.getAllChildren(this.array[tsKey].id));
            console.log(allChild);
            if (JSON.stringify(this.getAllChildren(this.array[tsKey].id)) !== JSON.stringify(allChild)) {
                console.log('testGetAllChildren error!');
            } else {
                console.log('testGetAllChildren access!');
            }

        }
    }

    testGetParent = () => {
        for (const tsKey in this.array) {

            let item = this.array.filter((el: { id: number; }) => {
                return el.id === this.array[tsKey].id
            })[0];
            let parent = this.array.filter((el: { id: any; }) => {
                return el.id === item.parent
            })[0];
            if (typeof parent === "undefined") parent = []
            if (JSON.stringify(this.getParent(this.array[tsKey].id)) !== JSON.stringify(parent)) {
                console.log('testGetParent error!');
            } else {
                console.log('testGetParent access!');
            }
        }
    }

    testGetAllParents = () => {
        for (const tsKey in this.array) {
            if (tsKey === '6') {
                let allParent: {[index: string]:any} = []
                // console.log(this.getAllParents(this.array[tsKey].id));

                // console.log(this.array);

                for (let arrayKey in this.array) {
                    if (typeof this.getParent(Number(arrayKey)).id !== "undefined") {
                        allParent.push(this.getParent(Number(arrayKey)))
                    }
                }
                console.log(this.getItem(this.array[tsKey].id));
                console.log(this.getParent(this.array[tsKey].id))
                // console.log(allParent);

                console.log(this.getAllParents(this.array[tsKey].id));
            }
            // console.log(allParent);
            // if (JSON.stringify(this.getAllParents(this.array[tsKey].id)) !== JSON.stringify(allParent)) {
            //     // console.log('testGetAllParents error!');
            // } else {
            //     // console.log('testGetAllParents access!');
            // }

        }
    }

    tests = () => {
        console.log('---------------------------- next tests -------------------------------')
        // this.testGetItem()
        // this.testGetChildren()
        // this.testGetParent()
        // this.testGetAllChildren()
        this.testGetAllParents()
    }

}
const ts = new TreeStore(items);
ts.tests()

// console.log(ts.getAll());
// console.log(ts.getItem(2));
// console.log(ts.getChildren(2));
// console.log(ts.getAllChildren(1));
// console.log(ts.getAllParents(3));



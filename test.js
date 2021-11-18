const object = {
    name: "adam",
    address: {
        country: "Bd",
        state: {
            stateName: "dhaka",
            area: {
                area: "12/a",
                street: "road 6",
                house: {
                    houseNo: "16",
                    floor: "3",
                    roomNo: "102"
                }
            }
        }
    }
}

const getObjectByKey = (key, obj) => {
    const keys = Object.keys(obj);
    if(!keys)
    {
        return null;
    }
    if(keys.includes(key))
    {
        return obj[key];
    }
    for (const k of keys) {
        const o = obj[k];
        if (o instanceof Object)
        {
           return getObjectByKey(key, o);
        }
    }
}
const res = getObjectByKey('house', object)
console.log(res);


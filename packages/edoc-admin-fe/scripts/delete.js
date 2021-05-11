const client = require('./client');

module.exports = async function() {
    const result = await client.list();

    if (!result.objects || !Array.isArray(result.objects)) {
        return;
    }

    await client.deleteMulti(result.objects.map(item => item.name), { quiet: true });
};

// (async function() {
//     const result = await client.list();

//     console.log(result.objects);
// })();
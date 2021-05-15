const client = require('./client');
const { EDOC_USERS_BUCKET_PREFIX } = require('./constants');

module.exports = async function() {
    const result = await client.list();

    if (!result.objects || !Array.isArray(result.objects)) {
        return;
    }

    const deletedItems = result.objects.filter(item => new RegExp(EDOC_USERS_BUCKET_PREFIX).test(item.url)).map(item => item.name);

    if (!deletedItems.length) {
        return;
    }

    await client.deleteMulti(deletedItems, { quiet: true });
};

(async function() {
    const result = await client.list();

    console.log(result.objects.filter(item => new RegExp('/edoc_admin/').test(item.url)));
})();
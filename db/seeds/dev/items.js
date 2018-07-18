
exports.seed = function(knex, Promise) {
  return knex('items').del()
    .then(() => {
      return Promise.all([
        knex('items').insert({
          name: 'GameBoy Advance SP',
          packed: true
        }, 'id')
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`))
};

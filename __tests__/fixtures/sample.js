/* global module */
class Widget {
  count = 0;

  increment = () => {
    this.count += 1;
    return this.count;
  };
}

async function loadUser(api, id) {
  const user = await api?.users?.get?.(id);
  return user ?? null;
}

const dynamic = () => import('./other');

module.exports = { Widget, loadUser, dynamic };

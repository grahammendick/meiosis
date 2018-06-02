/* global urlMapper */

const coffees = [
  { id: "c1", description: "Coffee 1" },
  { id: "c2", description: "Coffee 2" }
];

const coffeeMap = coffees.reduce((result, next) => {
  result[next.id] = next;
  return result;
}, {});

const beerList = [
  { id: "b1", title: "Beer 1" },
  { id: "b2", title: "Beer 2" }
];

// eslint-disable-next-line no-unused-vars
const services =  {
  loadCoffees: () => new Promise(resolve =>
    setTimeout(() => resolve(coffees), 1)
  ),
  loadCoffee: params => new Promise(resolve =>
    setTimeout(() => resolve(coffeeMap[params.id]||""))
  ),
  loadBeer: () => new Promise(resolve =>
    setTimeout(() => resolve(beerList), 1)
  )
};

// eslint-disable-next-line no-unused-vars
const createNavigation = update => {
  const stateNavigator = new Navigation.StateNavigator([
    { key: 'home', route: '' , component: createHome(update) },
    { key: 'coffee', component: createCoffee(update) },
    { key: 'beer', component: createBeer(update) },
    { key: 'beerDetails', component: createBeerDetails(update), tab: 'beer' },
  ]);

  const { coffee, beer } = stateNavigator.states;

  beer.navigating = (data, url, navigate) => {
    services.loadBeer().then(beerList => {
      navigate({ beerList });
    });
  }

  coffee.navigating = (data, url, navigate) => {
    services.loadCoffees().then(coffees => {
      if (data.id) {
        services.loadCoffee(data).then(coffee => {
          navigate(Object.assign({ coffee: coffee.description }, { coffees }));
        });
      }
      else {
        navigate({ coffees });
      }
    });
  }

  stateNavigator.onNavigate(() => {
    var inertHistoryManager = new Navigation.HTML5HistoryManager();
    inertHistoryManager.init = () => {};
    const immutableNavigator = new Navigation.StateNavigator(stateNavigator, inertHistoryManager);
    immutableNavigator.stateContext = stateNavigator.stateContext;
    immutableNavigator.historyManager = stateNavigator.historyManager;
    immutableNavigator.navigateLink = stateNavigator.navigateLink.bind(stateNavigator);
    const { data, asyncData, url } = stateNavigator.stateContext;
    update(model => Object.assign(model, data, asyncData, { stateNavigator: immutableNavigator }))
  });

  stateNavigator.start();

  const contextSync = ({ stateNavigator: immutableNavigator }) => {
    if (immutableNavigator && stateNavigator.stateContext !== immutableNavigator.stateContext) {
      stateNavigator.historyManager.addHistory(immutableNavigator.stateContext.url, false);
    }
  };

  return { stateNavigator, contextSync };
};

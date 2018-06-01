/* global pages */

const createBeerDetails = update => ({
  view: model => (<p>Details of beer {model.id}</p>)
});

const createBeer = update => {
  const actions = {
    beerDetails: (id, stateNavigator) => _evt => stateNavigator.navigate("beerDetails", { id }),
  };

  return {
    view: ({ beerList, stateNavigator }) => (
      <div>
        <p>Beer Page</p>
        <ul>
          {beerList.map(beer =>
            <li key={beer.id}>
              <a href={`#${stateNavigator.getNavigationLink("beerDetails", { id: beer.id })}`}>
                {beer.title}
              </a>
              {" "}
              <button className="btn btn-default btn-xs"
                onClick={actions.beerDetails(beer.id, stateNavigator)}>
                {beer.title}
              </button>
            </li>
          )}
        </ul>
      </div>
    )
  };
};

const createCoffee = update => ({
  view: ({ coffees, coffee, stateNavigator }) => (
    <div>
      <p>Coffee Page</p>
      {coffees.map(coffee => <span key={coffee.id}>
        <a href={`#${stateNavigator.getRefreshLink({ id: coffee.id })}`}>
          {coffee.id}
        </a>
        {" "}
      </span>)}
      {coffee}
    </div>
  )
});

const createHome = _update => ({
  view: _model => (<div>Home Page</div>)
});

// eslint-disable-next-line no-unused-vars
const createApp = update => {
  return {
    view: (model) => {
      var stateNavigator = model && model.stateNavigator;
      var state = stateNavigator && stateNavigator.stateContext.state;
      if (!state) return null;
      const isActive = tab => tab === (state.tab || state.key) ? "active" : "";
      return (
        <div>
          <nav className="navbar navbar-default">
            <ul className="nav navbar-nav">
              <li className={isActive("home")}>
                <a href="#/">Home</a>
              </li>
              <li className={isActive("coffee")}>
                <a href="#/coffee">Coffee</a>
              </li>
              <li className={isActive("beer")}>
                <a href="#/beer">Beer</a>
              </li>
              <li className="btn">
                <button className="btn btn-default"
                  onClick={_evt => stateNavigator.navigate("home")}>Home</button>
              </li>
              <li className="btn">
                <button className="btn btn-default"
                  onClick={_evt => stateNavigator.navigate("coffee")}>Coffee</button>
              </li>
              <li className="btn">
                <button className="btn btn-default"
                  onClick={_evt => stateNavigator.navigate("beer")}>Beer</button>
              </li>
            </ul>
          </nav>
          {state.component.view(model)}
        </div>
      );
    }
  };
};

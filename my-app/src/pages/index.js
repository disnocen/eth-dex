function Index() {
  return (
    <div className="App">
      {/* <h1>Index Page</h1> */}
      {/* move down a little */}
      <p style={{ textAlign: "center" }}>Welcome to the Token Faucet!</p>
      {/* center the next div */}
      <div style={{ textAlign: "center" }}>
        {/* add button linking to YTK_faucet */}
        <button>
          <a href="./YTK_faucet">YTK Faucet</a>
        </button>
        <br />
        {/* add button linking to RTK_faucet */}
        <button>
          <a href="./RTK_faucet">RTK Faucet</a>
        </button>
        <br />
        {/* add button linking to BTK_faucet */}
        <button>
          <a href="./BTK_faucet">BTK Faucet</a>
        </button>

        <br />
        <button>
          <a href="./Pool">Pool</a>
        </button>
      </div>
    </div>
  );
}

export default Index;

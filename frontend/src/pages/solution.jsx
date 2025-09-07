import "./css/solution.css";
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";

function Solution() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  

  return (
    <div>
      <div className="row">
        <Link className="box" id="description" to={`/description?query=${query}`}>description</Link>
        <Link className="box" id="hints" to={`/hints?query=${query}`}>hints</Link>
      </div>
      <div className="row">
        <Link className="box" id="go wrong" to={`/gowrong?query=${query}`}>Find errors</Link>
        <Link className="box" id="dry run" to={`/dryrun?query=${query}`}>dry run</Link>
      </div>
      <div className="row">
        <Link className="box" id="code" to={`/code?query=${query}`}>Solution</Link>
      </div>
    </div>
  );
}

export default Solution
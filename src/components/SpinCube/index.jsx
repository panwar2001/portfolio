import {
    faAngular,
    faCss3,
    faGitAlt,
    faHtml5,
    faJsSquare,
    faReact,
  } from '@fortawesome/free-brands-svg-icons'
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
  import {CubeSpinner,Face1,Face2,Face3,Face4,Face5,Face6} from './index.js';
  const  SpinCube= () => {
    return ( <CubeSpinner>
              <Face1 >
                <FontAwesomeIcon icon={faAngular} color="#DD0031" />
              </Face1>
              <Face2 >
                <FontAwesomeIcon icon={faHtml5} color="#F06529" />
              </Face2>
              <Face3 >
                <FontAwesomeIcon icon={faCss3} color="#28A4D9" />
              </Face3>
              <Face4 >
                <FontAwesomeIcon icon={faReact} color="#5ED4F4" />
              </Face4>
              <Face5 >
                <FontAwesomeIcon icon={faJsSquare} color="#EFD81D" />
              </Face5>
              <Face6 >
                <FontAwesomeIcon icon={faGitAlt} color="#EC4D28" />
              </Face6>
            </CubeSpinner>
    )
  }
  
  export default SpinCube;
  
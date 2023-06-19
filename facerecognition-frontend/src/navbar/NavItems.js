import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faPeopleGroup, faCircleInfo, faUser } from '@fortawesome/free-solid-svg-icons';

export const navItems = [
  {
    id: 1,
    title: "Página Inicial",
    path: "./",
    nName: "nav-item",
    sName: "sidebar-item",
    icon: <FontAwesomeIcon icon={faHouse} />,
  },
  {
    id: 2,
    title: "Funcionários",
    path: "./employees",
    nName: "nav-item",
    sName: "sidebar-item",
    icon: <FontAwesomeIcon icon={faPeopleGroup} />
  },
  {
    id: 3,
    title: "Sobre",
    path: "./about",
    nName: "nav-item",
    sName: "sidebar-item",
    icon: <FontAwesomeIcon icon={faCircleInfo} />,
  },

  {
    id: 4,
    title: "Utilizadores",
    path: './Accounts',
    nName: "nav-item",
    sName: "sidebar-item",
    icon: <FontAwesomeIcon icon={faUser} />,
  },
];
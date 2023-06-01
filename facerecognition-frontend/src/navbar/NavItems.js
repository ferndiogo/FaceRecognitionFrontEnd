import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faPeopleGroup, faDatabase, faCircleInfo } from '@fortawesome/free-solid-svg-icons';

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
    title: "Registos",
    path: "./",
    nName: "nav-item",
    sName: "sidebar-item",
    icon: <FontAwesomeIcon icon={faDatabase} />,
  },
  {
    id: 4,
    title: "Sobre",
    path: "./",
    nName: "nav-item",
    sName: "sidebar-item",
    icon: <FontAwesomeIcon icon={faCircleInfo} />,
  },
];
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faPeopleGroup, faCircleInfo, faUser, faKey } from '@fortawesome/free-solid-svg-icons';

export const navItems = [
  {
    id: 1,
    title: "Página Inicial",
    path: "./",
    nName: "nav-item",
    sName: "sidebar-item",
    icon: <FontAwesomeIcon icon={faHouse} />,
    role: ''
  },
  {
    id: 2,
    title: "Funcionários",
    path: "./employees",
    nName: "nav-item",
    sName: "sidebar-item",
    icon: <FontAwesomeIcon icon={faPeopleGroup} />,
    role: 'User'
  },
  {
    id: 3,
    title: "Sobre",
    path: "./about",
    nName: "nav-item",
    sName: "sidebar-item",
    icon: <FontAwesomeIcon icon={faCircleInfo} />,
    role: ''
  },
  {
    id: 4,
    title: "Utilizadores",
    path: './Accounts',
    nName: "nav-item",
    sName: "sidebar-item",
    icon: <FontAwesomeIcon icon={faUser} />,
    role: 'Admin'
  },
  {
    id: 5,
    title: "Password",
    path: './ChangePassword',
    nName: "nav-item",
    sName: "sidebar-item",
    icon: <FontAwesomeIcon icon={faKey} />,
    role: 'User'
  }
  
];

//{
//  id: 5,
//  title: "Iniciar Sessão",
//  path: "./login",
//  nName: "nav-item",
//  sName: "sidebar-item",
//  icon: <FontAwesomeIcon icon={faRightToBracket} style={{color: "#ffffff",}} />,
//  role: ''
//},
import UnAuthenticate from './errors/unauthenticate.js';
const checkpermission = (requser, resuserid) => {
  if (requser.userId === resuserid.toString()) return;
  throw new UnAuthenticate('you have no access to edit the jobs');
};
export default checkpermission;

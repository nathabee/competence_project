# TO DO LIST


## handle start stop for production

write doc and handle start of npm with systemctl
finish installing systemd


## test

test jenkins present configuration
test that automatic test run




## Jenkins

at the moment Jenkins sav and write with some priviledges.
This is not really clean and must be check how to improve to make it more secure.


### actuel setup

see jenkins.md file, we have installed :

add jenkins user in correct groupd to enable sav:

```bash 
 
sudo usermod -aG www-data jenkins
sudo chgrp -R www-data /home/nathabee/competence_project /home/nathabee/sav /var/www/competence_project
sudo chmod -R g+rwX /home/nathabee/competence_project /home/nathabee/sav /var/www/competence_project
sudo find /home/nathabee/competence_project /home/nathabee/sav /var/www/competence_project -type d -exec chmod g+s {} \;
 

sudo apt install -y acl

sudo setfacl -m u:jenkins:rx /home/nathabee
sudo setfacl -m u:jenkins:rwx /home/nathabee/sav
sudo setfacl -R -m u:jenkins:rwx /home/nathabee/competence_project
sudo setfacl -R -m u:jenkins:rwx /var/www/competence_project


sudo -u jenkins mkdir -p /home/nathabee/sav/test_from_jenkins
sudo -u jenkins touch /home/nathabee/sav/test_from_jenkins/ok
sudo -u jenkins rm -rf /home/nathabee/sav/test_from_jenkins

``` 

### Better long-term structure

user jenkins must be in the jenkins group, and in order to handle media and statisticsfile, also in www-data group

we should not put user jenkins in group nathabee (sudo acess)
but we have are actually using acl (setfacl) in order to solve the problem on the server delivery directories.

problem is =>  deployment paths are inside a private home directory. That is awkward for a service account.

Cleaner long-term would be to move them to something like:

/srv/competence_project
/srv/competence_backups
/var/www/competence_project

## Remarks (for the developper) about the status of the project

we need a code restructuration 
have at the end :
- django 
- frontend (containing source for wordpress plugin / demo / competence-app in standalone )

so for that we need to:
*  share code wordpress/plugin-src/competence  and competence-app the same way we had done it in competence-frontend (if possible)
* full code is in competence-app , this code work totally BUT does not have the demo user handled in the wordpress (to be added)
and does not handle shared code with a wordpress plugin

* adapt django : django (migrate test, installation, jenkins, user manual from competence and competence-app to use the structure o django )
* adapt frontend new structure into docs and jenkins

### history of the mess :

initially the django is in competence and competence_project
initially the associated frontend is competence-app

later we have created a competence-frontend to show how it is possible to shared code betweeen a react-app and a wordpress plugin

then we have use the competence code in the beelab project in order to show the possibility to share code in backend and in frontend and between many plugins, so there was new modification that was not put to the competence inital project, because at that moment the competence project was set as deprecated
/django and /wordpress are partially containing the code we need to use as reference in the future (wordpress contains a plugin for wordpress that can be used as frontend)
the plugin is not implementing totally the competence-app
the django part was modified n toder to use userCore separated from the competenceCore
we have a duplication because the competence-app , competence-frontend are all using the django from competence and competence_project


what we want to do in the future :

* use a single source of truth for backend (use the django : it had the concept of demo user )
* adapt the competence-app for that demo user concept (django backend)
* check if the competence-frontend can be reuse in order to share code
* finish the wordpress plugin by trying to see if competence-frontend wordpress plugin can beused for taht



# capstone-project-3900-t12a-jack-j

how to run:
python main.py(or api.py depends on which one is being used)

go to:
localhost:5000

**How to set up db?**
1. Install postgresql software from their website:
https://www.microfocus.com/documentation/idol/IDOL_12_0/MediaServer/Guides/html/English/Content/Getting_Started/Configure/_TRN_Set_up_PostgreSQL.htm
(Tutorial on setting up on windows machine)

2. Run the command "psql postgre" or "psql postgres" if the first doesn't work (at mac I run the command "brew services start postgresql" before this line. Not sure whats the corresponding line for windows->go check out the tutorial above plz)

Then run in your terminal
```sh
$ dropdb comp3900
$ createdb comp3900
$ psql comp3900 -f db.sql
```

<b>database and backend config?</b>
 1.Check out the database.py . Go to the connect_database function, check out the conn = psycopg2.connect(...user = xxx, password = xxx), change this user name and password to the one you have in your database system(The current one shows up is kim's)

 2. `pip install requirement.txt`


import requests
import mysql.connector
from datetime import date

URL = "https://data.cdc.gov/resource/9mfq-cb36.json"


createTableScript =  ("CREATE TABLE `T_Covid_Data` ("
    "  `id` int(20) NOT NULL AUTO_INCREMENT,"
    "  `submission_date` date NOT NULL,"
    "  `state` varchar(20) NOT NULL,"
    "  `tot_cases` int(20) NOT NULL,"
    "  `conf_cases` int(20) NOT NULL,"
    "  `new_case` int(20) NOT NULL,"
    "  `prob_cases` int(20) NOT NULL,"
    "  `pnew_case` int(20) NOT NULL,"
    "  `tot_death` int(20) NOT NULL,"
    "  `conf_death` int(20) NOT NULL,"
    "  `prob_death` int(20) NOT NULL,"
    "  `new_death` int(20) NOT NULL,"
    "  `pnew_death` int(20) NOT NULL,"
    "  `created_at` date NOT NULL,"
    "  `consent_cases` varchar(20) NOT NULL,"
    "  `consent_deaths` varchar(20) NOT NULL,"
    "  PRIMARY KEY (`id`)"
    ") ENGINE=InnoDB")


insertScript = ("INSERT INTO t_covid_data "
               "(submission_date, state, tot_cases, conf_cases, new_case, prob_cases, pnew_case, tot_death, conf_death, prob_death, new_death, pnew_death, created_at, consent_cases, consent_deaths) "
               "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")

def convertStringToDateTime(str):

    return None

r = requests.get(url = URL)

covidData = r.json()
 

try:

    cnx = mysql.connector.connect(user='root', password='password',
                                host='127.0.0.1',
                                port=3306,
                                database='covid19')
    cursor = cnx.cursor()

    # Uncomment to create table
    # cursor.execute(createTableScript)

    for data in covidData:
        insertData = (data['submission_date'] if 'submission_date' in data.keys() else date.today(), data['state'] if 'state' in data.keys() else 'NA',data['tot_cases'] if 'tot_cases' in data.keys() else 0, data['conf_cases'] if 'conf_cases' in data.keys() else 0,data['new_case'] if 'new_case' in data.keys() else 0,
        data['prob_cases'] if 'prob_cases' in data.keys() else 0, data['pnew_case'] if 'pnew_case' in data.keys() else 0 ,data['tot_death'] if 'tot_death' in data.keys() else 0, data['conf_death'] if 'conf_death' in data.keys() else 0, data['prob_death'] if 'prob_death' in data.keys() else 0,
        data['new_death'] if 'new_death' in data.keys() else 0, data['pnew_death'] if 'pnew_death' in data.keys() else 0,data['created_at'] if 'created_at' in data.keys() else date.today(), data['consent_cases'] if 'consent_cases' in data.keys() else 0,data['consent_deaths'] if 'consent_deaths' in data.keys() else 0)

        cursor.execute(insertScript, insertData)
        cnx.commit()
    cursor.close()
except mysql.connector.Error as err:
  if err.errno == mysql.connector.errorcode.ER_ACCESS_DENIED_ERROR:
    print("Something is wrong with your user name or password")
  elif err.errno == mysql.connector.errorcode.ER_BAD_DB_ERROR:
    print("Database does not exist")
  else:
    print(err)
else:
  cnx.close()


print("End of Script!!")
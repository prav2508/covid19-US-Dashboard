CREATE DATABASE covid19;

CREATE TABLE IF NOT EXISTS `t_covid_data` (
                `id` int(20) NOT NULL AUTO_INCREMENT,
                `submission_date` date NOT NULL,
                `state` varchar(20) NOT NULL,
                `tot_cases` int(20) NOT NULL,
                `conf_cases` int(20) NOT NULL,
                `new_case` int(20) NOT NULL,
                `prob_cases` int(20) NOT NULL,
                `pnew_case` int(20) NOT NULL,
                `tot_death` int(20) NOT NULL,
                `conf_death` int(20) NOT NULL,
                `prob_death` int(20) NOT NULL,
                `new_death` int(20) NOT NULL,
                `pnew_death` int(20) NOT NULL,
                `created_at date` NOT NULL,
                `consent_cases` varchar(20) NOT NULL,
                `consent_deaths` varchar(20) NOT NULL,
                PRIMARY KEY (`id`)
                )ENGINE=InnoDB;
    
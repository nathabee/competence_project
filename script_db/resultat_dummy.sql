-- Get the professeur_id for the name 'tea'
SET @professeur_id = (SELECT id FROM auth_user WHERE username = 'tea');

-- Get an eleve_id linked to the retrieved professeur_id
SET @eleve_id = (SELECT E.id 
                 FROM competence_eleve_professeurs EP 
                 JOIN competence_eleve E ON EP.eleve_id = E.id
                 WHERE EP.user_id = @professeur_id
                 LIMIT 1);  -- Ensure one eleve_id is retrieved

-- Insert into competence_resultat using the dynamic eleve_id and professeur_id
INSERT INTO competence_resultat (score, seuil1_percent, seuil2_percent, seuil3_percent, eleve_id, groupage_id, professeur_id)
SELECT 
  0 AS score,  -- Initial score, which will be updated later 
  100 AS seuil1_percent, 
  50 AS seuil2_percent, 
  0 AS seuil3_percent, 
  @eleve_id AS eleve_id, 
  G.id AS groupage_id,
  @professeur_id AS professeur_id
FROM competence_groupagedata G
WHERE G.catalogue_id = 31;

 

-- Check if resultat_id was successfully retrieved and not NULL by using a JOIN that ensures proper linking
-- Insert into competence_resultatdetail using the dynamic eleve_id, professeur_id, and resultat_id
INSERT INTO competence_resultatdetail (resultat_id, scorelabel, observation, score, eleve_id, professeur_id, testdetail_id)
SELECT 
  R.id AS resultat_id,  -- Link to the newly created competence_resultat
  'A' AS scorelabel, 
  'test data' AS observation, 
  I.max_score / 2 AS score,  -- Half of max_score for testing purposes
  @eleve_id AS eleve_id, 
  @professeur_id AS professeur_id, 
  I.id AS testdetail_id
FROM competence_groupagedata G
JOIN competence_item I ON G.id = I.groupagedata_id
JOIN competence_resultat R ON R.eleve_id = @eleve_id AND R.groupage_id = G.id
WHERE G.catalogue_id = 31;

-- Update the scores in competence_resultat based on corresponding entries in competence_resultatdetail
UPDATE competence_resultat R
JOIN (
  SELECT 
    RD.resultat_id,  -- Link by resultat_id (foreign key in competence_resultatdetail)
    SUM(RD.score) AS total_score
  FROM competence_resultatdetail RD
  WHERE RD.eleve_id = @eleve_id
  GROUP BY RD.resultat_id  -- Group by resultat_id to ensure accurate updates
) AS scores ON R.id = scores.resultat_id  -- Match based on the foreign key (resultat_id)
SET R.score = scores.total_score;

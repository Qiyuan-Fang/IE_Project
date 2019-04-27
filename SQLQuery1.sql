BULK INSERT [dbo].[Road_Segments]
FROM 'C:\Users\Keon\Desktop\road_safe_index_modified.csv'
WITH
(
    FIRSTROW = 2,
    FIELDTERMINATOR = ',',  --CSV field delimiter
    ROWTERMINATOR = '\n',   --Use to shift the control to next row
    TABLOCK
)
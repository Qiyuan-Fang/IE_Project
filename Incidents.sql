CREATE TABLE [dbo].[Incidents]
(
	[IncidentId] INT NOT NULL IDENTITY(1,1), 
    [Longitude] FLOAT NOT NULL,
    [Latitude] FLOAT NOT NULL, 
    [TimeStamp] DATETIME NOT NULL
	CONSTRAINT [PK_Incidents] PRIMARY KEY CLUSTERED ([IncidentId] ASC)
)

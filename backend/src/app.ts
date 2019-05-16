import express from "express";
import { NextFunction, Request, Response } from "express";
import { Datastore } from "@google-cloud/datastore";
import bodyParser from "body-parser";

type Incident = {
  name: string;
  date: string;
};

const PROJECT_ID = "bluescreen";

// Creates a client
const datastore = new Datastore({
  projectId: PROJECT_ID
});

const kind = "BluescreenIncidents";

async function getData() {
  const query = datastore.createQuery(kind);
  return await datastore.runQuery(query);
}

async function saveData(entity: Incident) {
  console.log("Saving entity: " + JSON.stringify(entity));

  // The Cloud Datastore key for the new entity
  const key = datastore.key([kind]);

  // Prepares the new entity
  const entityToSave = {
    key: key,
    data: {
      name: entity.name,
      date: entity.date
    }
  };

  await datastore.save(entityToSave);
}

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500);
  res.send(err);
};

// Create Express server
const app = express();
app.use(bodyParser.json());

// Express configuration
app.set("port", process.env.PORT || 3001);

app.get("/", (req, res) => {
  res.send("Bluescreen Server");
});

app.get("/incidents", async (req, res, next) => {
  try {
    const data = await getData();
    res.send(data);
  } catch (e) {
    next(e);
  }
});
app.post("/incidents", async (req, res, next) => {
  try {
    const entity = req.body;
    await saveData(entity);
    res.status(200);
  } catch (e) {
    next(e);
  }
});

app.use(errorHandler);

export default app;

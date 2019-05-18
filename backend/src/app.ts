import express from "express";
import { NextFunction, Request, Response } from "express";
import { Datastore } from "@google-cloud/datastore";
import bodyParser from "body-parser";
import cors from "cors";

type Incident = {
  id: string;
  name: string;
  date: string;
};

const PROJECT_ID = "bluescreen";

// Creates a client
const datastore = new Datastore({
  projectId: PROJECT_ID
});

const kind = "BluescreenIncidents";

const corsOptions = {
  origin: 'https://bluescreen.appspot.com',
  optionsSuccessStatus: 200,
  methods: ["GET", "POST"]
};

async function getData() {
  const query = datastore.createQuery(kind).order("date", { descending: true });
  const [incidents] = await datastore.runQuery(query);
  return incidents.map((elem: any) => ({
    name: elem.name,
    date: elem.date,
    id: elem[datastore.KEY].id
  }));
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
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Express configuration
app.set("port", process.env.PORT || 3001);

app.get("/api/", (req, res) => {
  res.send("Bluescreen API Server");
});

app.get("/api/incidents", async (req, res, next) => {
  try {
    const data = await getData();
    res.send(data);
  } catch (e) {
    next(e);
  }
});

app.post("/api/incidents", async (req, res, next) => {
  try {
    const entity = req.body;
    await saveData(entity);
    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
});

app.use(errorHandler);

export default app;

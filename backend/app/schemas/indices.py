from pydantic import BaseModel, ConfigDict
from datetime import datetime

class IndexReponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    code: str
    name: str



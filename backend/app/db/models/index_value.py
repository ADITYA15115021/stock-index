from app.db.database import Base
from sqlalchemy import Integer, String, Numeric, DateTime, ForeignKey
from datetime import datetime 
from sqlalchemy.orm import Mapped, mapped_column

class IndexValue(Base):
    __tablename__ = "index_value"

    id: Mapped[int] = mapped_column(primary_key=True)

    index_id: Mapped[int] = mapped_column(ForeignKey("security.id"), nullable=False)

    index_value: Mapped[float] = mapped_column(Numeric(20,4), nullable=False)

    timestamp: Mapped[datetime] = mapped_column(
    DateTime(timezone=True),
    nullable=False
    )

    total_free_float_market_cap: Mapped[float] = mapped_column(Numeric(20,4), nullable=False)

    divisor: Mapped[float] = mapped_column(Numeric(20,4), nullable=False)


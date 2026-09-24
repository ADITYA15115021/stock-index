from app.db.database import Base
from sqlalchemy.orm import Mapped, mapped_column 
from sqlalchemy import Integer, String, DateTime, Numeric, ForeignKey
from datetime import datetime

class MarketData(Base):
    __tablename__ = "market_data"

    id: Mapped[int] = mapped_column(primary_key=True)

    security_id: Mapped[int] = mapped_column(ForeignKey("security.id"), nullable=False)

    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False
    )

    last_price: Mapped[float] = mapped_column(Numeric(20,4), nullable=False)

    total_market_cap: Mapped[float] = mapped_column(Numeric(20,4), nullable=False)

    free_float_market_cap: Mapped[float] = mapped_column(Numeric(20,4), nullable=False)

    impact_cost: Mapped[float] = mapped_column(Numeric(20,4), nullable=False)

    issued_size: Mapped[int | None] = mapped_column()

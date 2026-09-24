from datetime import date
from sqlalchemy import Date, ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column
from app.db.database import Base


class IndexDaily(Base):
    __tablename__ = "index_daily"

    id: Mapped[int] = mapped_column(primary_key=True)

    index_id: Mapped[int] = mapped_column(
        ForeignKey("indices.id"),
        nullable=False
    )

    date: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    open: Mapped[float] = mapped_column(
        Numeric(15, 4),
        nullable=False
    )

    high: Mapped[float] = mapped_column(
        Numeric(15, 4),
        nullable=False
    )

    low: Mapped[float] = mapped_column(
        Numeric(15, 4),
        nullable=False
    )

    close: Mapped[float] = mapped_column(
        Numeric(15, 4),
        nullable=False
    )

    change: Mapped[float] = mapped_column(
        Numeric(15, 4),
        nullable=False
    )

    change_percent: Mapped[float] = mapped_column(
        Numeric(10, 4),
        nullable=False
    )
from datetime import date

from sqlalchemy import Date, ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class IndexDivisor(Base):
    __tablename__ = "index_divisors"

    id: Mapped[int] = mapped_column(primary_key=True)

    index_id: Mapped[int] = mapped_column(
        ForeignKey("indices.id"),
        nullable=False
    )

    divisor: Mapped[float] = mapped_column(
        Numeric(20, 10),
        nullable=False
    )

    effective_from: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    effective_to: Mapped[date | None] = mapped_column(
        Date
    )

    index: Mapped["Indices"] = relationship(
        back_populates="divisors"
    )
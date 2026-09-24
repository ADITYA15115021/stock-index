from app.db.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey
from datetime import date
from sqlalchemy import Date


class IndexConstituent(Base):
    __tablename__ = "index_constituents"

    id:  Mapped[int] = mapped_column(primary_key=True)

    index_id: Mapped[int] = mapped_column(ForeignKey("indices.id"), nullable=False)
    security_id: Mapped[int] = mapped_column(ForeignKey("security.id"), nullable=False)

    weight: Mapped[float] = mapped_column(nullable=True)

    effective_from: Mapped[date] = mapped_column(Date,nullable=False)
    effective_to: Mapped[date | None] = mapped_column(Date)

    index: Mapped["Indices"] = relationship(
        back_populates="constituents"
    )

    security: Mapped["Security"] = relationship(
        back_populates="index_constituents"
    )